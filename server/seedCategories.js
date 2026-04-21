const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const categories = [
    { label: 'Beach', icon: 'TbBeach' },
    { label: 'Windmills', icon: 'GiWindmill' },
    { label: 'Modern', icon: 'MdOutlineVilla' },
    { label: 'Countryside', icon: 'TbMountain' },
    { label: 'Pools', icon: 'TbPool' },
    { label: 'Islands', icon: 'GiIsland' },
    { label: 'Lake', icon: 'GiBoatFishing' },
    { label: 'Skiing', icon: 'FaSkiing' },
    { label: 'Castles', icon: 'GiCastle' },
    { label: 'Caves', icon: 'GiCaveEntrance' },
    { label: 'Camping', icon: 'GiForestCamp' },
    { label: 'Arctic', icon: 'BsSnow' },
    { label: 'Desert', icon: 'GiCactus' },
    { label: 'Barns', icon: 'GiBarn' },
    { label: 'Lux', icon: 'IoDiamond' },
]

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbd6wjw.mongodb.net/?appName=Cluster0`
const client = new MongoClient(uri, {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
})

async function seed() {
    try {
        await client.connect()
        const db = client.db('stayvista')
        const col = db.collection('categories')
        await col.deleteMany({})
        await col.insertMany(categories)
        console.log('Categories seeded successfully!')
    } finally {
        await client.close()
    }
}

seed().catch(console.dir)