import { writeFileSync } from 'fs'

const environment = `

NODE_ENV=${process.env.NODE_ENV}
SERVER_BASE_URL=${process.env.SERVER_BASE_URL}
    
`
writeFileSync('./.env', environment.trim())
