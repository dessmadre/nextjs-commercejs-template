import commerce from 'lib/commercejs';

// Get Merchant information
export default async function getMerchantInfo(req, res) {
  const data = await commerce.merchants.about();

  res.json(data);
}
