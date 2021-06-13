import useSWR from 'swr';

import fetcher from 'utils/fetcher';
import ProductsList from 'components/ProductList';

export default function ProductsPage() {
  const { data: products } = useSWR('/api/products', fetcher);

  return (
    <>
      <h1 className='text-7xl font-bold lowercase'>Products</h1>
      {products ? (
        <ProductsList products={products?.data} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
