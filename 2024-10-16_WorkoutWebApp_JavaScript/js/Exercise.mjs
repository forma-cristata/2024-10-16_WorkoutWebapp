export {Exercise, SetRepExercise, TimerExercise};

class Exercise
{
    constructor(name, type)
    {
        this.name = name;
        this.type = type
    }
}

class SetRepExercise extends Exercise
{
    constructor(name, type = "set/rep", sets, reps)
    {
        super(name, type);
        this.sets = sets;
        this.reps = reps;
        Object.seal(this)
    }
}

class TimerExercise extends Exercise
{
    constructor(name, type = "timer", hours, minutes)
    {
        super(name, type);
        this.hours = hours;
        this.minutes = minutes;
        Object.seal(this);
    }
}