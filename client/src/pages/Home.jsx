import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import OfferSection from '../components/OfferSection'
import TrustedBy from '../components/TrustedBy'

const Home = () => {
  return (
    <div>
      <Hero />
      <JobListing />
      <AppDownload />
      <OfferSection />
      <TrustedBy />
    </div>
  )
}

export default Home