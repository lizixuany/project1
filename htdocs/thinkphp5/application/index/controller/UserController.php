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
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            // 将字符串 "null" 转换为 null
            $data = array_map(function($value) {
                return $value === 'null' ? null : $value;
            }, $data);
            
            // 定制查询信息
            $condition = [];
            
            // 获取用户名
            $username = $data['username'];

            if ($username !== null && $username !== '') {
                $condition['user.username'] = ['like', '%' . $username . '%'];
            }

            // 获取学校ID
            $school_id = $data['school'];

            if ($school_id !== null && $school_id !== '') {
                $condition['school.id'] = $school_id;
            }

            // 获取班级ID
            $clazz_id = $data['clazz'];

            if ($clazz_id !== null && $clazz_id !== '') {
                $condition['clazz.id'] = $clazz_id;
            }

            // 获取角色
            $role = $data['role'];

            if ($role !== null && $role !== '') {
                $condition['role'] = $role;
            }

            // 获取角色
            $state = $data['state'];

            if ($state !== null && $state !== '') {
                $condition['state'] = $state;
            }
          
            // 使用 User::withSchool 方法获取与班级相关的学校信息
            $user = new User();
            $clazzWithSchool = $user->withSchool($clazz_id);
            
            $list = User::with(['clazz', 'school'])
                    ->where($condition)
                    ->order('role', 'asc') // 按role字段从小到大排序
                    ->page($page, $size)
                    ->select();
            $total = User::with(['clazz', 'school'])
                    ->where($condition)
                    ->page($page, $size)
                    ->count();
            
            $pageData = [
              'content' => $list,
              'number' => $page, // ThinkPHP的分页参数是从1开始的
              'size' => $size,
              'totalPages' => ceil($total / $size),
              'numberOfElements' => $total,
              'clazzWithSchool' => $clazzWithSchool
            ];
          
            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 获取相应账号的数据
            $result = User::where('username', $data['username'])->find();
            if ($result) {
                return json(['error' => '用户已存在'], 401);
            }
            if ($data['role'] === 1) {
                $role = User::where('role', 1)->find();
                if ($role) {
                    return json(['error' => '超级管理员有且只有一位'], 401);
                }
            }
           
            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($data['username']) || empty($data['username'])){
                return json(['status' => 'error', 'message' => 'username is required']);
            }
            if (!isset($data['sex']) || empty($data['sex'])){
                return json(['status' => 'error', 'message' => 'sex is required']);
            }
            if (!isset($data['role']) || empty($data['role'])){
                return json(['status' => 'error', 'message' => 'role is required']);
            }
            if (!isset($data['state']) || empty($data['state'])){
                return json(['status' => 'error', 'message' => 'state is required']);
            }
            if (!isset($data['school_id']) || empty($data['school_id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($data['clazz_id']) || empty($data['clazz_id'])){
                return json(['status' => 'error', 'message' => 'Clazz is required']);
            }
            
            // 创建班级对象并保存
            $user = new User();
            
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->password = 'yunzhi';
            $user->sex = $data['sex'];
            $user->role = $data['role'];
            $user->state = 1;
            $user->school_id = $data['school_id'];
            $user->clazz_id = $data['clazz_id'];
            $user->save();

            return json(['status' => 'success']);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = User::with(['clazz', 'school'])->where('user.id', $data)->select();
            
            return json($list);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function update() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            $clazz = $data['clazz'];

            $id = $data['id'];
            
            // 获取传入的班级信息
            $user = User::get($id);
            if (is_null($user)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }
            // 获取相应账号的数据
            $users = User::where('username', $data['username'])
                            ->where('id', '<>', $id) // 排除当前用户ID
                            ->select();
            if (count($users) > 0) {
                return json(['error' => '用户已存在'], 401);
            }

            if ($data['role'] === 1) {
                $roles = User::where('role', 1)->select();
                if ($roles) {
                    foreach ($roles as $role) {
                        if ($role->id !== $data['id']) {
                            return json(['error' => '超级管理员有且只有一位'], 401);
                        } 
                    }
                }
            }

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($data['username']) || empty($data['username'])){
                return json(['status' => 'error', 'message' => 'username is required']);
            }
            if ($data['sex'] !== 0 && $data['sex'] !== 1){
                return json(['status' => 'error', 'message' => 'sex is required']);
            }
            if (!isset($data['role']) || empty($data['role'])){
                return json(['status' => 'error', 'message' => 'role is required']);
            }
            if (!isset($data['state']) || empty($data['state'])){
                return json(['status' => 'error', 'message' => 'state is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($clazz['id']) || empty($clazz['id'])){
                return json(['status' => 'error', 'message' => 'Clazz is required']);
            }
            
            // 创建班级对象并保存
            
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->password = 'yunzhi';
            $user->sex = $data['sex'];
            $user->role = $data['role'];
            $user->state = $data['state'];
            $user->school_id = $school['id'];
            $user->clazz_id = $clazz['id'];
            $user->save();

            return json(['status' => 'success']);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除班级
    public function delete()
    {
        try {
            $user = UserController::getUser();
            if (!$user) {
                return json(['status' => 'error', 'message' => '用户不存在']);
            }

            // 删除用户
            if ($user->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getUser() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $user = User::get($id);
        return $user;
    }

    public static function getRoleUser() {
        $list = User::with(['clazz', 'school'])
                    ->where('role', 'in', [2, 3])
                    ->select();
        return json($list);
    }

    public function roleChange() {
        try {
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $userchanged = User::where('id', $data['userChangedId'])
                                ->find();
            if ($userchanged) {
                $userchanged->role = 2;
                $userchanged->save();
            } else {
                return json(['error' => '用户未找到'], 401);
            }

            $user = User::where('id', (int)$data['userId'])
                        ->find();
            if ($user) {
                $user->role = 1;
                $user->save();
            } else {
                return json(['error' => '用户未找到'], 401);
            }

        return json(['status' => 'success']);
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function getClazzBySchoolId() {
        $request = Request::instance();
        $schoolId = $request->param('schoolId');

        // 使用 school_id 获取班级列表
        $clazzes = Clazz::where('school_id', $schoolId)->select();
        return json($clazzes);
    }

    public function getUserWhenSoryChange() {
        $request = Request::instance();
        $schoolId = $request->param('schoolId');
        $clazzId = $request->param('clazzId');

        $users = User::where('school_id', $schoolId)->where('clazz_id', $clazzId)->select();
        return json($users);
    }
}
