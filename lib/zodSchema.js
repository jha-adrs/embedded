const {z} = require('zod');

const waterLevelSchema = z.object({
    sensorID: z.number(),
    householdID: z.number(),
    waterLevelLiters: z.number(),
    timestamp: z.string(),
});

module.exports = {
    waterLevelSchema
};