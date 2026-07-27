FROM joseluisq/static-web-server:2
COPY  hi.html /public/index.html
ENTRYPOINT ["/static-web-server"]