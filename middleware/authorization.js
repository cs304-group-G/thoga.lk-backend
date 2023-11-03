const authorization = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized", message: err.message });
      } else {
        const role = decoded.role;
        if (req.isAuthenticated() && allowedRoles.includes(role)) {
          req.user = decoded;
          return next();
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      }
    });
  };
};

export default authorization;
