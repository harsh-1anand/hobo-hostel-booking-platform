import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>HOBO</h2>
          <p>Urban stays made simple.</p>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <p>About Us</p>
          <p>Careers</p>
          <p>Press</p>
          <p>Blog</p>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Safety</p>
          <p>Cancellation Options</p>
          <p>Contact Us</p>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
          <p>Cookies</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 HOBO. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;