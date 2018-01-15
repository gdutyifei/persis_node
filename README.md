# persis_node
读书会Persis后端部分，用nodeJS，Express框架实现

#结构说明
/bin:用来启动应用（服务器）
/public: 存放静态资源目录
/routes：路由用于确定应用程序如何响应对特定端点的客户机请求，包含一个 URI（或路径）和一个特定的 HTTP 请求方法（GET、POST 等）。每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。
/views: 模板文件所在目录 文件格式为.jade
目录app.js程序main文件 这个是服务器启动的入口