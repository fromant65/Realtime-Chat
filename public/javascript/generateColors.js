function generateColorByUsername(user) {
  if (!user) return "222222";
  const hashUser = hashCode(user);
  const posUser = Math.abs(hashUser);
  let hashStr = posUser.toString(16);
  hashStr = [...hashStr].reverse().join("");
  //console.log(colorHex, user, user.toString(16));
  //console.log(hashStr);
  const red = `${hashStr[0] || 6}${hashStr[3] || 6}`;
  const green = `${hashStr[1] || 6}${hashStr[4] || 6}`;
  const blue = `${hashStr[2] || 6}${hashStr[5] || 6}`;
  const color = red + green + blue;
  return color;
}

function hashCode(code) {
  var hash = 0,
    i,
    chr;
  if (code.length === 0) return hash;
  for (i = 0; i < code.length; i++) {
    chr = code.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
