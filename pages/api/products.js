import commerce from 'lib/commercejs';

// Get all the products available
export default async function getProducts(req, res) {
  const data = await commerce.products.list();

  res.json(data);
}
