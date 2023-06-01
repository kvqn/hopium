import GradientLink from "@/components/GradientLink/GradientLink"
import Navbar from "@/components/Navbar"
import { getBatches } from "@/lib/data"

export const getStaticProps = async () => {
  const batches = await getBatches()
  return { props: { batches: batches } }
}

type Props = {
  batches: string[]
}

export default function Page({ batches }: Props) {
  return (
    <>
      <Navbar />
      <div className="mt-20">
        <h1 className="heading-select">
        Select your batch
        </h1>
        <ul className="text-center text-3xl mt-10">
          {batches.map((batch) => (
            <li key="{batch}">
              <GradientLink href={`/result/${batch}`} name={batch} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
