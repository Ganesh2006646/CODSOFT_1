const STATUS_FLOW = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderTimeline = ({ statusHistory }) => {
  const historyMap = new Map(
    (statusHistory || []).map((item) => [item.status, item])
  );
  const currentStatus = statusHistory && statusHistory.length > 0
    ? statusHistory[statusHistory.length - 1].status
    : null;

  return (
    <div className="space-y-4">
      {STATUS_FLOW.map((step, index) => {
        const entry = historyMap.get(step);
        const isDone = Boolean(entry);
        const isCurrent = currentStatus === step;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${isDone ? 'bg-indigo-600' : 'bg-gray-300'} ${isCurrent ? 'animate-pulse' : ''}`}></div>
              {index < STATUS_FLOW.length - 1 && (
                <div className={`w-px flex-1 ${isDone ? 'bg-indigo-200' : 'bg-gray-200'}`} style={{ minHeight: '24px' }}></div>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
              {entry?.timestamp && (
                <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
