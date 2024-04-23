const {z} = require('zod');

const waterLevelSchema = z.object({
    deviceID: z.string(),
    sensorID: z.string(),
    homeLocation: z.string(),
    waterLevel: z.number().int().positive(),
    timestamp: z.string(),
    timezone: z.string(),
    tankCapacity: z.number().int().positive(),
    tankHeight: z.number().int().positive(),
    tankRadius: z.number().int().positive(),
    tankVolume: z.number().int().positive(),

});

module.exports = {
    waterLevelSchema
};