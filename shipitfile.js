module.exports = function(shipit) {
  require('shipit-deploy')(shipit);

  var deployPath = '/usr/src/auction-scraper';

  shipit.initConfig({
    default: {
      workspace: '/tmp/auction-scraper',
      deployTo: deployPath,
      repositoryUrl: 'git@github.com:robtarr/auction-scraper.git',
      ignores: ['.git', 'node_modules'],
      // rsync: ['--del'],
      keepReleases: 2,
      key: '/Users/Rob/.ssh/id_rsa.pub',
      shallowClone: false,
      npm: {
        remote: true,
        installArgs: ['gulp'],
        installFlags: ['-g']
      }
    },
    production: {
      servers: '159.203.92.26'
    }
  });

  shipit.on('deployed', function() {
    return shipit.remote('cd ' + deployPath + ' && npm install && npm run build');
  });
};
