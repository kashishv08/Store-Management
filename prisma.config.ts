import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
    engine: 'classic',
    datasource: {
        url: process.env.MONGODB_URL!,
    },
})