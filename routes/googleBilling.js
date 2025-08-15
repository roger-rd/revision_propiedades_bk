const express = require('express');
const router = express.Router();
const pool = require('../config/bd_revision_casa');

const PRICE = {
  places_autocomplete: Number(process.env.GOOGLE_PRICE_AUTOCOMPLETE || 2.83), // USD / 1000
  place_details:       Number(process.env.GOOGLE_PRICE_PLACE_DETAILS || 17.00),
  geocoding:           Number(process.env.GOOGLE_PRICE_GEOCODING || 5.00),
  maps_js:             Number(process.env.GOOGLE_PRICE_MAPS_JS || 7.00),
};

router.get('/summary', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const params = [];
    let where = 'WHERE 1=1';

    if (from) { params.push(from); where += ` AND date_used >= $${params.length}`; }
    if (to)   { params.push(to);   where += ` AND date_used <= $${params.length}`; }

    const { rows: byApi } = await pool.query(
      `SELECT api_name, SUM(units)::int AS units
       FROM google_api_usage
       ${where}
       GROUP BY api_name
       ORDER BY api_name`,
      params
    );

    const { rows: daily } = await pool.query(
      `SELECT date_used::date AS date, api_name, SUM(units)::int AS units
       FROM google_api_usage
       ${where}
       GROUP BY date_used, api_name
       ORDER BY date_used DESC, api_name`,
      params
    );

    const totals = byApi.map(r => {
      const p = PRICE[r.api_name] || 0;
      const cost = (Number(r.units) / 1000) * p;
      return {
        api_name: r.api_name,
        units: Number(r.units),
        cost_usd: Number(cost.toFixed(4)),
      };
    });

    const grand_total_usd = Number(
      totals.reduce((acc, t) => acc + t.cost_usd, 0).toFixed(4)
    );

    res.json({ totals, grand_total_usd, daily, price_per_1000_usd: PRICE });
  } catch (e) { next(e); }
});

module.exports = router;
