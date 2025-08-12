export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Trendify</h3>
            <p className="text-gray-400">Your one-stop destination for trending products and amazing deals.</p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/products" className="hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/deals" className="hover:text-white">
                  Deals
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/help" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/privacy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Trendify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
