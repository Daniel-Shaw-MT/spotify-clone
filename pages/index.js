import Head from 'next/head'
import SideBar from '../components/SideBar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      {/* <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className="">
        {/* Sidebar */}
        <SideBar />

        {/* Center */}

      </main>

      <div>
        {/* player */}
      </div>
    </div>
  )
}
