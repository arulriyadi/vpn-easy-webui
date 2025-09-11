function ipVersion(ip) {
  return ip.includes(":") ? 6 : ip.includes(".") ? 4 : 0;
}
function parseIp(ip) {
  const version = ipVersion(ip);
  if (!version) throw new Error(`Invalid IP address: ${ip}`);
  let number = 0n;
  let exp = 0n;
  const res = /* @__PURE__ */ Object.create(null);
  if (version === 4) {
    for (const n of ip.split(".").map(BigInt).reverse()) {
      number += n * 2n ** exp;
      exp += 8n;
    }
  } else {
    if (ip.includes(".")) {
      res.ipv4mapped = true;
      ip = ip.split(":").map((part) => {
        if (part.includes(".")) {
          const [a, b, c, d] = part.split(".").map((str) => Number(str).toString(16).padStart(2, "0"));
          return `${a}${b}:${c}${d}`;
        } else {
          return part;
        }
      }).join(":");
    }
    if (ip.includes("%")) {
      let scopeid;
      [, ip, scopeid] = /(.+)%(.+)/.exec(ip) || [];
      res.scopeid = scopeid;
    }
    const parts = ip.split(":");
    const index = parts.indexOf("");
    if (index !== -1) {
      while (parts.length < 8) {
        parts.splice(index, 0, "");
      }
    }
    for (const n of parts.map((part) => BigInt(parseInt(part || "0", 16))).reverse()) {
      number += n * 2n ** exp;
      exp += 16n;
    }
  }
  res.number = number;
  res.version = version;
  return res;
}
const bits = { 4: 32, 6: 128 };
const cidrVersion = (cidr) => cidr.includes("/") ? ipVersion(cidr) : 0;
function parse(str) {
  const cidrVer = cidrVersion(str);
  const parsed = /* @__PURE__ */ Object.create(null);
  if (cidrVer) {
    parsed.cidr = str;
    parsed.version = cidrVer;
  } else {
    const version2 = ipVersion(str);
    if (version2) {
      parsed.cidr = `${str}/${bits[version2]}`;
      parsed.version = version2;
    } else {
      throw new Error(`Network is not a CIDR or IP: ${str}`);
    }
  }
  const [ip, prefix] = parsed.cidr.split("/");
  if (!/^[0-9]+$/.test(prefix)) {
    throw new Error(`Network is not a CIDR or IP: ${str}`);
  }
  parsed.prefix = prefix;
  parsed.single = prefix === String(bits[parsed.version]);
  const { number, version } = parseIp(ip);
  const numBits = bits[version];
  const ipBits = number.toString(2).padStart(numBits, "0");
  const prefixLen = Number(numBits - prefix);
  const startBits = ipBits.substring(0, numBits - prefixLen);
  parsed.start = BigInt(`0b${startBits}${"0".repeat(prefixLen)}`);
  parsed.end = BigInt(`0b${startBits}${"1".repeat(prefixLen)}`);
  return parsed;
}
export {
  parse as p
};
