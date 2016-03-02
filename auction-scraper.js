import cheerio from 'cheerio';
import request from 'request-promise';
import _ from 'lodash';
import chalk from 'chalk';
import * as slack from './slack';

let auctions = [];

function filterAuction(formData) {
  const options = {
    uri: 'http://bid.bidfta.com/cgi-bin/mnlist.cgi',
    method: 'POST',
    form: formData,
    transform: (body) => {
      return cheerio.load(body);
    },
  };

  return request(options).then(function($) {
    let items = [];
    const ending = $('#TableTop').find('tr').find('td:nth-child(4)').text()
          .replace(/.*Internet Only Auction - (.*)/g, '$1');

    $('tr.DataRow').each(function(i, el) {
      if ($(el).find('td').last().text() === 'ended') { return; }

      const itemId = $(el).attr('id');
      const price = $(el).find('td:nth-child(6)').text();

      if (process.argv[3] && process.argv[3] < price) { return; }

      items.push({
        text: `http://bid.bidfta.com/cgi-bin/mnlist.cgi?${formData.auction}/${itemId}`,
        price: '$' + price,
        ending: ending,
        image: $(el).find('img').attr('src'),
      });
    });

    return items;
  });
}

function find(keyword, auctions) {
  auctions.forEach((id) => {
    const formData = {
      auction: id,
      keyword: keyword,
      stype: 'ANY',
    };

    filterAuction(formData).then(function(items) {
      _.compact(items).forEach((item) => {
        slack.send({
          text: item.text + ' - ' + item.price + ' - ' + item.ending,
          image: item.image,
        });
      });
    });
  });
  console.log(`Results for ${chalk.red(keyword)} sent to Slack.`);
}

function getAuctionList() {
  let options = {
    uri: 'http://www.bidfta.com/search?utf8=%E2%9C%93&keywords=&search%5Btagged_with%5D=&location=Dayton%2C+Oh',
    transform: (body) => {
      return cheerio.load(body);
    }
  };

  return request(options).then(function($) {

    $('.currentAuctionsListings .auction').each(function(i, e) {
      const href = $(this).find('a').attr('href'),
            id = href.replace(/.*\?(.*)/, '$1');

      auctions.push(id);
    });
  });
}

function getItems() {
  getAuctionList().then(function() {
    find(process.argv[2], auctions);
  });
}

getItems();
