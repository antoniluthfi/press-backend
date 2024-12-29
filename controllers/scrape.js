const axios = require('axios');
const cheerio = require('cheerio');

exports.getLatestAnnouncement = async (req, res) => {
  const { page = 1 } = req.query;

  const url = `https://if.unsil.ac.id/page/${page}`;

  try {
    // Ambil HTML dari halaman target
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const announcement = [];

    // Seleksi elemen berdasarkan class yang diberikan
    $('div.gdlr-core-blog-item-holder > div.gdlr-core-item-list').each((index, element) => {
      // Misalnya, kita ambil teks atau konten HTML dari elemen ini
      const title = $(element).text().trim();
      const img = $(element).find('img').attr('src');
      const href = $(element).find('a').attr('href');

      if (img) {
        announcement.push({ title, img, href });
      }
    });

    res.json({
      success: true,
      data: announcement
    });  
  } catch (error) {
    console.error('Error saat scraping:', error.message);
    res.json({
      success: false,
      message: error.message
    });  
  }
}
