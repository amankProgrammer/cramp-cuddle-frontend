import { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';

interface Period {
  startDate: string;
  endDate?: string;
}

const PeriodTracker = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [averageCycle, setAverageCycle] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);

  useEffect(() => {
    const savedPeriods = localStorage.getItem('periods');
    if (savedPeriods) {
      setPeriods(JSON.parse(savedPeriods));
    }
  }, []);

  useEffect(() => {
    if (periods.length > 0) {
      localStorage.setItem('periods', JSON.stringify(periods));
      calculateCycleAndNextPeriod();
    }
  }, [periods]);

  const calculateCycleAndNextPeriod = () => {
    if (periods.length >= 2) {
      // Sort periods by start date
      const sortedPeriods = [...periods].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      let totalDays = 0;
      let count = 0;
      
      for (let i = 1; i < sortedPeriods.length; i++) {
        const prevPeriodStart = new Date(sortedPeriods[i-1].startDate);
        const currentPeriodStart = new Date(sortedPeriods[i].startDate);
        
        const daysBetween = Math.round((currentPeriodStart.getTime() - prevPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysBetween > 0 && daysBetween < 60) { // Filter out unrealistic cycles
          totalDays += daysBetween;
          count++;
        }
      }
      
      if (count > 0) {
        const avg = Math.round(totalDays / count);
        setAverageCycle(avg);
        
        // Calculate next period
        const lastPeriod = new Date(sortedPeriods[sortedPeriods.length - 1].startDate);
        const nextDate = new Date(lastPeriod);
        nextDate.setDate(lastPeriod.getDate() + avg);
        
        setNextPeriod(nextDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newStartDate) {
      const newPeriod: Period = {
        startDate: newStartDate,
        endDate: newEndDate || undefined
      };
      
      setPeriods([...periods, newPeriod]);
      setNewStartDate('');
      setNewEndDate('');
      setShowForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-violet-700">Period Calendar</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-violet-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
        
        {averageCycle && nextPeriod && (
          <div className="bg-pink-50 p-4 rounded-lg mb-4">
            <p className="text-pink-800">
              <span className="font-medium">Average cycle:</span> {averageCycle} days
            </p>
            <p className="text-pink-800">
              <span className="font-medium">Next period expected:</span> {formatDate(nextPeriod)}
            </p>
          </div>
        )}
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {periods.length > 0 ? (
            [...periods]
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((period, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-violet-50 rounded-lg">
                  <Calendar size={20} className="text-violet-500" />
                  <div>
                    <div className="text-violet-800 font-medium">
                      {formatDate(period.startDate)}
                    </div>
                    {period.endDate && (
                      <div className="text-sm text-violet-600">
                        to {formatDate(period.endDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No periods tracked yet. Add your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;
