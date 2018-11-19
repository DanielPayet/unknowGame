export const env = {
    port: {
        http: +process.env.PORT_HTTP || 3000,
        https: +process.env.PORT_HTTPS || 8443
    },
    distLocationLocation: process.env.dist || "/dist",
    nbDots: 2000
}