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

    // 间接关联school表
    public function school()
    {
        return $this->belongsTo('School');
    }

    // 关联term表
    public function term()
    {
        return $this->belongsTo(Term::class, 'term_id', 'id');
    }
}

