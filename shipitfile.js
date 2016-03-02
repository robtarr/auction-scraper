module.exports = function(shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/auction-scraper',
      deployTo: '/usr/src/auction-scraper',
      repositoryUrl: 'https://github.com/robtar/auction-scraper.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      key: '/home/deploy/.ssh/',
      shallowClone: true
    },
    staging: {
      servers: '159.203.92.26'
    },
    production: {
      servers: '159.203.92.26'
    }
  });
};
