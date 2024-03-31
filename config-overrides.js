module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "http": false,
        "https": false,
        "zlib": false,
        "path": false,
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer"),
        "crypto": require.resolve("crypto-browserify") // see here this was my error
    }
    
    return config
}