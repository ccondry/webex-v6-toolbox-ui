import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import requireContext from 'rollup-plugin-require-context'
import { visualizer } from 'rollup-plugin-visualizer'
import copy from 'rollup-plugin-copy'
import cleaner from 'rollup-plugin-cleaner'
import { spawn } from 'child_process'
import { mkdirSync } from 'fs'

const production = !process.env.ROLLUP_WATCH
const port = 5005
const outputDir = 'dist/webex-v6'

// livereload can't watch a directory that doesn't exist yet
if (!production) {
  mkdirSync(outputDir, { recursive: true })
}

export default {
  input: 'src/main.js',
  output: {
    dir: outputDir,
    entryFileNames: 'app.js',
    format: 'iife',
    sourcemap: !production ? 'inline' : false,
    name: 'app',
  },
  plugins: [
    // cleaning on every watch rebuild deletes the served files and breaks the
    // livereload watcher, so only clean for production builds
    production &&
      cleaner({
        targets: [
          'dist'
        ]
      }),
    copy({
      targets: [
        { src: 'src/index.html', dest: outputDir },
        { src: 'src/assets/*', dest: `${outputDir}/assets` }
      ],
      // re-copying on every watch rebuild triggers a livereload per file
      copyOnce: !production
    }),
    json(),
    alias({
      entries: [{ find: 'src', replacement: __dirname + '/src' }],
    }),
    image(),
    postcss({
      extract: 'app.css',
      to: `${outputDir}/app.css`,
      config: { path: 'postcss.config.js' }
    }),
    requireContext(),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json', '.vue']
    }),
    commonjs({
      // requireReturnsDefault: 'auto',
    }),
    // scriptSetup(),
    vue({
      css: false,
      needMap: false,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
      preventAssignment: true,
    }),
    esbuild({
      minify: production,
      target: 'es2015',
    }),
    !production &&
      visualizer({
        open: false,
      }),
    !production &&
      serve({
        open: true,
        openPage: '/webex-v6/',
        contentBase: 'dist',
        historyApiFallback: '/webex-v6/',
        port,
        onListening () {
          spawn(process.execPath, ['dev/webex-campaign-api.js'], {
            cwd: __dirname,
            stdio: 'inherit',
          })
        },
      }),
    !production &&
      livereload({
        watch: outputDir,
        // let rollup finish writing the bundle before the browser fetches it
        delay: 300
      }),
  ],
  watch: {
    clearScreen: true,
  },
}
