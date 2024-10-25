<?php
namespace app\common\model;
use think\Model;

class User extends Model
{
    protected $table = 'user';
    
    // 关联clazz表
    public function clazz()
    {
       return $this->belongsTo('Clazz');
    }

    // 关联school表
    public function school()
    {
       return $this->belongsTo('School');
    }

    public function withSchool($clazz_id) {
        $schools = Clazz::with('school')->select();
        return $schools;
    }
}