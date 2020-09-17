module.exports = {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],

    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@visly/state': './node_modules/@visly/state/dist/browser',
                },
            },
        ],
    ],
}
