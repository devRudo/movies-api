const pool = require('./connect.js').pool;

let query = async (q, param) => {
    try {
        const client = await pool.connect()
        if (param === undefined) {
            let result = await client.query(q);
            client.release();
            return result;
        }
        else {
            let result = await client.query(q, param);
            client.release();
            return result;
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = { query };