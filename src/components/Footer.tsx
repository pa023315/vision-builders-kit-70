import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/10 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <Link
            to="/about"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <span>關於我們</span>
          </Link>
          
          <a
            href="mailto:service@pa023315.com"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>聯繫我們: service@pa023315.com</span>
          </a>

          <Link
            to="/changelog"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <span>更新紀錄</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;