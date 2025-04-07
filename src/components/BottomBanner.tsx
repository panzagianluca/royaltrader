export default function BottomBanner() {
  return (
    <div className="h-12 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center px-4">
      <div className="flex space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Open Positions:</span>
          <span className="text-sm font-medium dark:text-white">0</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Open Orders:</span>
          <span className="text-sm font-medium dark:text-white">0</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Pending Orders:</span>
          <span className="text-sm font-medium dark:text-white">0</span>
        </div>
      </div>
    </div>
  )
}
