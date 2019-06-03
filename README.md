# Low-boilerplate Monolthic Microservice Demonstration

This projects serves as a proof of concept for how a monolithic-scale project could adopt lightweight microservices in a manner that is truely infrustructure agonistic.

## Ideas

* Middleware
  Through the code generation part of this system it is possible to apply middleware.
  It could serve purposes such as authentication across a subset or the entire suit of services to reduce boilerplate.

## Workspace

```powershell
rollup .\hello-name.js --format cjs --file out.js --preferConst
```

Class properties are not yet part of standards (though at stage 3, so they will go ahead). A babel plugin is the best bet for now.
