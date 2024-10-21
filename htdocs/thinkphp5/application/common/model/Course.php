<?php
namespace app\common\model;
use think\Model;

class Course extends Model
{
    // 学期表
    protected $table = 'course';

    // 关联clazz表
    public function clazz()
    {
        return $this->belongsTo('Clazz');
    }

    // 关联term表
    public function term()
    {
        return $this->belongsTo('Term');
    }
}

