import Slack from 'slack-client';
import _ from 'lodash';
import env from 'dotenv';

env.config();
const slack = new Slack.WebClient(process.env.slackToken);

export function send(msg) {
  const attachment = JSON.stringify([{
        fallback: msg.text + ' - ' + msg.price + ' - ' + msg.ending,
        image_url: msg.image,
      }]);
  const slackChannel = '#' + process.env.slackChannel.replace('#', '');

  slack.chat.postMessage(slackChannel, msg.text, {
    attachments: attachment
  });
}
