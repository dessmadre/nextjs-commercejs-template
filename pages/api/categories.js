import commerce from 'lib/commercejs';

// Get all available categories
export default async function getCategories(req, res) {
  const data = await commerce.categories.list();

  res.json(data);
}
