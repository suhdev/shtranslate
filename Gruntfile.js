module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
  options: {
    dest: 'docs',
    scripts: ['./dist/scripts/app.min.js'],
    html5Mode: true,
    startPage: '/api',
    title: "My Awesome Docs",
    
    titleLink: "/api",
    bestMatch: true,
    
  },
  api: {
    src: ['./src/*.js','./src/**/*.js'],
    title: 'API Documentation'
  }
}
    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-ngdocs');

  // Default task(s).
  grunt.registerTask('default', ['ngdocs']);

};