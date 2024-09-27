<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use app\common\model\User; // 假设你有一个User模型位于app\index\model目录下
use app\common\model\Clazz;
use app\common\model\School;
use think\Db;

class UserController extends controller
{
    public function index() {
        $id = Request::instance()->param('id/d');
        var_dump($id);
        // if (is_null($id) || $id === 0) {
        //     return $this->error('未获取到ID信息');
        // }
        // 获取对象
        $User = User::get($id);
        var_dump($User);
        die();
       // 数据库查询
       $user = Db::table('user')->where('id',$User)->select();

       return json(['code' => 200, 'msg' => 'Login success.', 'user' => $user]);
    }
}