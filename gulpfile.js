var gulp = require('gulp');


gulp.task("webpack", function(callback) {
    // run webpack
    webpack({
        // configuration
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('default', function () {
  bird.start(birdConfig.servers, birdConfig.transRules);
  gulp.src(['undefined.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
  gulp.watch(['src/app/**/*', "!src/app/app-templates.js"], ['hint', 'b']);
});

var bird = require('gulp-bird');
var birdConfig = require('./bird-config.json');