/*jslint node: true */
'use strict';

// Grunt configuration wrapper function.
module.exports = function (grunt) {

    // Configurable paths and other variables. 
    var config = {
        webroot: 'web',
        src: 'src',
        dist: 'dist',
        testroot: 'test',
        custom: 'custom-libs',
        vendor: 'bower_components',
        tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>',
        LIVE_PORT: 35729,
        WEB_PORT: 9001
    };

    // Initialize our configuration object.
    grunt.initConfig({

        /*
         * Get configuration options. 
         */
        config: config,


        /*
         * Get the project metadata.
         */
        pkg: grunt.file.readJSON('package.json'),

        /*
         * Create a dynamic build header. 
         */
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
            '<%= grunt.template.today("dd-mm-yyyy-hh:MM:ss") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> |' +
            ' Licensed <%= pkg.license %>\n */\n',


        /*
         * Start a static web server. 
         * DEV URL http://localhost:9001/.
         * To view the local site on another device on the same LAN, use your master machine's IP address instead, for example http://10.0.0.32:9001/.
         */
        connect: {
            livereload: {
                options: {
                    base: '<%= config.webroot %>',
                    port: config.WEB_PORT, // The port on which the webserver will respond.
                    hostname: '*' // Default 'localhost'. Setting this to '*' will make the server accessible from anywhere. Useful for cross-device testing.
                }
            }
        },


        /*
         * Run predefined tasks whenever watched file patterns are added, changed or deleted.
         */
        watch: {
            options: {
                // Reload assets live in the browser.
                livereload: config.LIVE_PORT // Default livereload listening port.
            },
            tpl: {
                files: ['<%= config.src %>/tpl/**/*.tpl'],
                tasks: [
                    'template:dev'
                ]
            },
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: [
                    'less:dev'
                ]
            },
            js: {
                files: ['<%= config.src %>/js/**/*.js'],
                tasks: [
                    'mantriDeps',
                    'jshint',
                    'copy:src',
                    'copy:mantri',
                    'jasmine:dev'
                ],
                options: {
                    livereload: true
                }
            },
            jasmine: {
                files: ['<%= config.testroot %>/**/*-spec.js'],
                tasks: ['jasmine:dev']
            },
            build: {
                files: ['<%= config.dist %>/**/*'],
                tasks: ['notify:build']
            },
            watch: {
                files: ['<%= config.webroot %>/**/*'],
                tasks: ['notify:watch']
            }
        },


        /*
         * Compile Less to CSS.
         */
        less: {
            dev: {
                files: {
                    '<%= config.webroot %>/css/app.css': '<%= config.src %>/less/app.less'
                }
            },
            dist: {
                files: {
                    '<%= config.dist %>/app.min.css': '<%= config.src %>/less/app.less'
                },
                options: {
                    yuicompress: true,
                    compress: true
                }
            }
        },


        /*
         * Lint CSS files.
         */
        csslint: {
            options: {
                csslintrc: '.csslintrc' // Get CSSLint options from external file.
            },
            strict: {
                options: {}
                // src: ['<%= config.webroot %>/css/*.css']
            },
            lax: {
                options: {},
                src: ['<%= config.webroot %>/css/*.css']
            }
        },


        /*
         * Validate files with JSHint.
         */
        jshint: {
            // Configure JSHint (documented at http://www.jshint.com/docs/).
            options: {
                jshintrc: '.jshintrc', // Get JSHint options from external file.
                jshintignore: '.jshintignore'
            },
            // Define the files to lint.
            files: [
                'Gruntfile.js',
                '<%= config.src %>/js/**/*.js' // Only process custom scripts, exclude libraries.
            ]
        },

        /*
         * Grunt task to include files and replace variables. Allows for parameterised includes.
         */
        template: {
            dev: {
                options: {
                    data: {
                        scripts: [{
                            src: 'bower_components/mantri/dist/mantri.web.js',
                            'data-require': 'app',
                            'data-deps': './deps',
                            'data-config': './mantriConf.dev'
                        }, {
                            src: '//localhost:<%= config.LIVE_PORT %>/livereload.js'
                        }],
                        style: {
                            href: 'css/app.css'
                        }
                    }
                },
                files: [{
                    src: '<%= config.src %>/tpl/index.tpl',
                    dest: '<%= config.webroot %>/index.html'
                }]
            },
            dist: {
                options: {
                    data: {
                        scripts: [{
                            src: 'app.min.js'
                        }],
                        style: {
                            href: 'app.min.css'
                        }
                    }
                },
                files: [{
                    src: '<%= config.src %>/tpl/index.tpl',
                    dest: '<%= config.dist %>/index.html'
                }]
            }
        },


        /*
         * A mystical CSS icon solution.
         * See http://filamentgroup.com/lab/grunticon/.
         */
        grunticon: {
            makeicons: {
                options: {

                    // Required config.
                    src: '<%= config.webroot %>/img/icons',
                    dest: '<%= config.webroot %>/css/components/modules/icons',

                    // Optional grunticon config properties:

                    // CSS filenames.
                    datasvgcss: 'icons.data.svg.css',
                    datapngcss: 'icons.data.png.css',
                    urlpngcss: 'icons.fallback.css',

                    // Preview HTML filename.
                    previewhtml: 'preview.html',

                    // Grunticon loader code snippet filename.
                    loadersnippet: 'grunticon.loader.txt',

                    // Folder name (within dest) for png output.
                    pngfolder: 'png/',

                    // Prefix for CSS classnames.
                    cssprefix: 'icon-',

                    // CSS file path prefix - this defaults to "/" and will be 
                    // placed before the "dest" path when stylesheets are loaded.
                    // This allows root-relative referencing of the CSS. If you 
                    // don't want a prefix path, set to to "".
                    cssbasepath: '/'

                }
            }
        },


        /*
         * Order, optimize and compile js src with mantri.
         */
        mantriDeps: {
            options: {
                root: '<%= config.webroot %>'
            },
            dev: {
                src: '<%= config.webroot %>/js/',
                dest: '<%= config.webroot %>/deps.js'
            }
        },


        mantriBuild: {
            options: {
                debug: true
            },
            dist: {
                src: 'mantriConf.dist.json',
                dest: '<%= config.dist %>/app.min.js'
            }
        },

        /*
         * Grunt plugin for jasmine test runner.
         */
        jasmine: {
            dev: {
                src: [],
                options: {
                    specs: '<%= config.testroot %>/**/*-spec.js',
                    template: '<%= config.testroot %>/test.tpl',
                    outfile: '<%= config.webroot %>/_SpecRunner.html',
                    templateOptions: {
                        mantriPath: '<%= config.vendor %>/mantri/dist/mantri.web.js',
                        depsPath: 'deps',
                        requirePath: 'app',
                        configPath: 'mantriConf.dev'
                    }
                }
            },
            dist: {
                src: '<%= config.dist %>/app.min.js',
                options: {
                    specs: '<%= config.testroot %>/**/*-spec.js'
                }
            }
        },


        /*
         * Minify PNG and JPEG images using OptiPNG and jpegtran.
         */
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,                       // Enable dynamic expansion.
                    cwd: '<%= config.dist %>/img/',  // Src matches are relative to this path.
                    src: '**/*.{png,jpg,jpeg}',         // Actual pattern(s) to match.
                    dest: '<%= config.dist %>/img/'     // Destination path prefix.
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: {
                    '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
                }
            }
        },

        copy: {
            mantri: {
                files: [{
                    src: 'mantri*',
                    dest: '<%= config.webroot %>/'
                }]
            },
            src: {
                files: [{
                    src: ['**/*.js'],
                    dest: '<%= config.webroot %>/js/',
                    cwd: '<%= config.src %>/js/',
                    expand: true
                }]
            },
            vendor: {
                files: [{
                    src: '<%= config.vendor %>/**/*.js',
                    dest: '<%= config.webroot %>/',
                    filter: 'isFile'
                }]
            }
        },

        /*
         * Analyze the size of our output
         */
        bytesize: {
            dist: {
                src: [
                    'dist/*'
                ]
            }
        },

        notify: {
            server: {
                options: {
                    title: 'Watching for changes',
                    message: 'Server running on localhost:<%= config.WEB_PORT %>'
                }
            },
            watch: {
                options: {
                    title: 'Build success',
                    message: 'Watching for changes'
                }
            },
            build: {
                options: {
                    title: 'Build success',
                    message: 'Ready for deployment'
                }
            }
        },

        lodash: {
            target: {
                dest: '<%= config.custom %>/lodash.custom.js'
            },
            options: grunt.file.readJSON('lodashConf.json')
        },

        modernizr: grunt.file.readJSON('modernizrConf.json')
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('mantri');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-bytesize');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-lodash');
    grunt.loadNpmTasks('grunt-modernizr');

    // The default (DEV) task can be run just by typing "grunt" on the command line.
    grunt.registerTask('default', [
        'template:dev',
        'less:dev',
        'copy',
        'mantriDeps',
        'jshint',
        'jasmine:dev',
        'connect',
        'notify:server',
        'watch'
    ]);


    // The optimized production build would be run by typing "grunt dist" on the command line.
    grunt.registerTask('dist', [
        'template:dist',
        'htmlmin',
        'less:dist',
        'jshint',
        'customBuild',
        'mantriBuild',
        'jasmine:dist',
        'bytesize',
        'notify:build'
    ]);

    grunt.registerTask('customBuild', [
        'lodash',
        'modernizr'
    ]);


    // The icons generator would be run by typing "grunt icons" on the command line.
    grunt.registerTask('icons', [
        'grunticon'
    ]);
};