import logo from '../resources/DALL·E 2024-10-20 18.38.38 - A creative logo for the HealthTrove project, incorporating colors from modern healthcare themes like soft blues, greens, and dark grays. The logo shou.webp'
const Footer = () => {
  return (
    <footer className="relative mt-[80px]">
      {/* Gradient top border */}
      <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
      
      {/* Main footer content */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-indigo-700/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="HealthTrove Logo" className="h-10 w-10 rounded-full border-2 border-purple-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  HealthTrove
                </h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your go-to on-chain patient management and healthcare scheduling system.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-purple-400 text-sm transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-sm uppercase mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Contact
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Email:{' '}
                  <a href="mailto:support@healthtrove.com" className="hover:text-purple-400 transition-colors duration-200">
                    support@healthtrove.com
                  </a>
                </p>
                <p className="text-sm text-gray-300">Phone: +1 (234) 567-8900</p>
                <p className="text-sm text-gray-300">Address: 123 Healthcare Lane, Wellness City</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                  >
                    <i className={`fab fa-${social} text-white`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; 2024 HealthTrove. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;