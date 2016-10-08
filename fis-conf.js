//本地后台环境
fis.
media('rddev').
match('*.{js,css,png}',{
    useHash:false,
    useSprite:false,
    optimizer:null
});

// online's jsonp api
fis.
media('jsonpdev').
match('*.{js,css,png}',{
    useHash:false,
    useSprite:false,
    optimizer:null
});

//本地前端环境
//npm install -g fis3-deploy-replace
fis.
media('fedev').
match('*.{js,css,png}',{
    useHash:false,
    useSprite:false,
    optimizer:null
}).
match('**', {
    deploy: [
        fis.plugin('replace', {
            from: /http:\/\/adms\.emao\.com\/fl\/getadc[s]?/,
            to: '/test/data'
        }),
        fis.plugin('local-deliver')
    ]
});

//前端同学开发完自测没问题后，执行此命令
fis.
media('build').
match('*.js',{
    optimizer:fis.plugin('uglify-js'),
    useHash:false,
    useSprite:false
});
