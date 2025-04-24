interface SubCategoryProps {
  params: Promise<{
    category: string
    subcategory: string
  }>
}

const SubCategory = async ({ params }: SubCategoryProps) => {
  const { category, subcategory } = await params
  return (
    <div>
      <h1>{category}</h1>
      <h1>{subcategory}</h1>
    </div>
  )
}
export default SubCategory
