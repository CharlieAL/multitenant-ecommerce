interface CategoryProps {
  params: Promise<{
    category: string
  }>
}

const Category = async ({ params }: CategoryProps) => {
  const { category } = await params

  return (
    <div>
      <h1>{category}</h1>
    </div>
  )
}
export default Category
