const path = require('path');

module.exports = (env) => {
  const target = env && env.target || 'chrome'; // 'chrome' or 'firefox'

  return {
    entry: {
      background: `./src/${target}/background.ts`,
      content: `./src/${target}/content.ts`,
      popup: `./src/${target}/popup.ts`,
    },
    output: {
      path: path.resolve(__dirname, `dist/${target}`),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: 'production',
  };
};
