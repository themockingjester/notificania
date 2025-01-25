const { config } = require("../../di-container")
const { exportedDIContainer } = require("../../exportedDiContainer")

async function fetchData({
    useCache,
    cacheName,
    cacheKey,
    functionToCall,
    cacheExpiryTime


}) {

    let cachedData
    // Checking in cache first
    if (useCache && exportedDIContainer.caching.strategy) {
        cachedData = await exportedDIContainer.caching.strategy.getKey(
            {
                cacheName: cacheName
                , key: cacheKey
            }

        )

    }

    if (cachedData) {
        return {
            data: cachedData,
            fromCache: true
        }
    }
    let resultantData = await functionToCall
    await exportedDIContainer.caching.strategy.setKey(
        {
            cacheName: cacheName
            , key: cacheKey, dataToCache:
                resultantData, expiryInSeconds: cacheExpiryTime
        }

    )
    return {
        data: resultantData,
        fromCache: false
    }


}

module.exports = {
    fetchData
}