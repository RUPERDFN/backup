export function securityMiddleware(){
  return function(req,res,next){
    // Sanitizado básico de prompt si existe
    if (req.body && typeof req.body.prompt === 'string') {
      req.body.prompt = req.body.prompt.trim().slice(0, 2500);
    }
    next();
  };
}
