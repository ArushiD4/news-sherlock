import socket
import re
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

# 1. Regex for a standard URL
URL_REGEX = re.compile(
    r'^(https?://)'  # http:// or https://
    r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
    r'localhost|'  # localhost...
    r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
    r'(?::\d+)?'  # optional port
    r'(?:/?|[/?]\S+)$', re.IGNORECASE)

# 2. List of "Private" IP ranges (SSRF Protection)
# If a URL resolves to these, we BLOCK it.
def is_private_ip(ip):
    # Simple check for 127.0.0.1, 192.168.x.x, 10.x.x.x
    return (
        ip.startswith("127.") or
        ip.startswith("192.168.") or
        ip.startswith("10.") or
        ip.startswith("0.")
    )

def sanitize_url(url):
    """
    Cleans the URL by removing tracking parameters (utm_, fbclid, etc.)
    """
    parsed = urlparse(url)
    
    # Clean query parameters
    query_params = parse_qsl(parsed.query)
    clean_params = []
    
    # List of noisy tracking params to remove
    blocklist = {'utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'ref', 'gclid'}
    
    for key, value in query_params:
        if key.lower() not in blocklist:
            clean_params.append((key, value))
            
    # Rebuild URL
    new_query = urlencode(clean_params)
    clean_url = urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))
    return clean_url

def validate_url(url):
    """
    Full security check. Returns (True, clean_url) or (False, error_message).
    """
    # 1. Basic Format Check
    if not URL_REGEX.match(url):
        return False, "Invalid URL format"

    # 2. Sanitize (Remove tracking junk)
    url = sanitize_url(url)
    parsed = urlparse(url)

    # 3. Scheme Check (Must be http or https)
    if parsed.scheme not in ['http', 'https']:
        return False, "Only HTTP/HTTPS URLs are allowed"

    # 4. SSRF Check (The Hacker Protection)
    try:
        hostname = parsed.hostname
        # Resolve hostname to IP address
        ip_address = socket.gethostbyname(hostname)
        
        if is_private_ip(ip_address):
            return False, "Malicious Input: Cannot access internal networks."
            
    except socket.gaierror:
        return False, "Domain does not exist"

    return True, url