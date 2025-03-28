import React from "react";

const Footer = () => {
  return (
    <div className="">
      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white">
                    real time{" "}
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Management
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Evaluation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Integrations</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white">
                    React
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Node
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    supabase 
                  </a>
                  <a
                    href="https://github.com/avikkk19/notyetnamed"
                    className="hover:text-white"
                  >
                    <p className="text-xs">visit github instead</p>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Interactive
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Experimental
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    About us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm">
            <p>© 2025 avinash.</p>
          </div>{" "}
          <p className="text-sm">
            Dev is stupid
            <a
              className="hover:text-white px-2"
              href="https://instagram.com/spidey33x_"
            >
              @spidey33x_
            </a>{" "}
            if you wanna reach out.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
