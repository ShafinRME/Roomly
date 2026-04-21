import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { useState } from 'react'
import logoImg from '../../../assets/images/logo.png'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Safety', path: '/safety' },
      { name: 'Cancellation', path: '/cancellation' },
      { name: 'Contact Us', path: '/contact' },
    ],
    hosting: [
      { name: 'Host Your Home', path: '/host' },
      { name: 'Resources', path: '/resources' },
      { name: 'Community', path: '/community' },
      { name: 'Host Handbook', path: '/handbook' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Sitemap', path: '/sitemap' },
    ],
  }

  const socialLinks = [
    { Icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook' },
    { Icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { Icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { Icon: FaLinkedinIn, url: 'https://linkedin.com', label: 'LinkedIn' },
    { Icon: FaGithub, url: 'https://github.com', label: 'GitHub' },
  ]

  return (
    <footer className='bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200'>
      {/* Newsletter Section */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                Stay in the loop
              </h3>
              <p className='text-gray-600'>
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className='flex gap-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200'
                  required
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transform hover:scale-105 transition duration-200 shadow-md hover:shadow-lg'
                >
                  {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <Link to='/' className='inline-block mb-4'>
              <img
                src={logoImg}
                alt='logo'
                width='120'
                height='120'
                className='transform hover:scale-105 transition duration-200'
              />
            </Link>
            <p className='text-gray-600 text-sm mb-4'>
              Making home rentals easy, safe, and memorable for everyone.
            </p>
            <div className='flex gap-3'>
              {socialLinks.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transform hover:scale-110 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-md'
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className='font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider'>
              Company
            </h4>
            <ul className='space-y-2'>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='text-gray-600 hover:text-rose-500 text-sm transition duration-200 inline-block hover:translate-x-1'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider'>
              Support
            </h4>
            <ul className='space-y-2'>
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='text-gray-600 hover:text-rose-500 text-sm transition duration-200 inline-block hover:translate-x-1'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider'>
              Hosting
            </h4>
            <ul className='space-y-2'>
              {footerLinks.hosting.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='text-gray-600 hover:text-rose-500 text-sm transition duration-200 inline-block hover:translate-x-1'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider'>
              Legal
            </h4>
            <ul className='space-y-2 mb-6'>
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className='text-gray-600 hover:text-rose-500 text-sm transition duration-200 inline-block hover:translate-x-1'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className='space-y-2 text-sm text-gray-600'>
              <div className='flex items-center gap-2 hover:text-rose-500 transition duration-200'>
                <MdEmail className='flex-shrink-0' />
                <a href='mailto:support@example.com'>support@example.com</a>
              </div>
              <div className='flex items-center gap-2 hover:text-rose-500 transition duration-200'>
                <MdPhone className='flex-shrink-0' />
                <a href='tel:+1234567890'>+1 (234) 567-890</a>
              </div>
              <div className='flex items-center gap-2'>
                <MdLocationOn className='flex-shrink-0' />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-600 text-sm'>
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            <div className='flex gap-6 text-sm text-gray-600'>
              <button className='hover:text-rose-500 transition duration-200 flex items-center gap-1'>
                🌐 English (US)
              </button>
              <button className='hover:text-rose-500 transition duration-200 flex items-center gap-1'>
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 opacity-50'></div>
    </footer>
  )
}

export default Footer
