import { useState } from 'react';
import { funeralHallDesigns } from '@/data/funeralHallDesigns';
import { FUNERAL_HALL_STYLE_CONFIG, type FuneralHallDesign, type FuneralHallStyle } from '@/types';
import { useStore } from '@/store/useStore';
import { SmartImage } from '@/components/common/SmartImage';
import {
  Heart,
  X,
  Star,
  DollarSign,
  Users,
  ListChecks,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface HallDesignCardProps {
  design: FuneralHallDesign;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewDetail: () => void;
  index: number;
}

const HallDesignCard = ({ design, isFavorite, onToggleFavorite, onViewDetail, index }: HallDesignCardProps) => {
  const styleConfig = FUNERAL_HALL_STYLE_CONFIG[design.style];

  return (
    <div
      className="card hover:shadow-lg transition-all animate-slide-up overflow-hidden group cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onViewDetail}
    >
      <div className="relative -mx-6 -mt-6 mb-4">
        <SmartImage
          src={design.imageUrl}
          alt={design.name}
          aspectRatio="video"
          objectFit="cover"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
          fallbackTitle={design.name}
          fallbackDescription="效果图加载中，点击查看详情"
        />
        <span className={`absolute top-3 left-3 badge ${styleConfig.bgColor} ${styleConfig.color} shadow-sm`}>
          {styleConfig.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white/90 text-slate-400 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h4 className="font-semibold text-slate-800 mb-2">{design.name}</h4>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{design.description}</p>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          <span>预算：{design.estimatedBudget}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span className="truncate max-w-[100px]">{design.suitableFor}</span>
        </div>
      </div>
    </div>
  );
};

interface HallDesignDetailModalProps {
  design: FuneralHallDesign | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const HallDesignDetailModal = ({ design, isOpen, onClose, isFavorite, onToggleFavorite }: HallDesignDetailModalProps) => {
  if (!isOpen || !design) return null;

  const styleConfig = FUNERAL_HALL_STYLE_CONFIG[design.style];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        <div className="relative">
          <SmartImage
            src={design.imageUrl}
            alt={design.name}
            aspectRatio="video"
            objectFit="cover"
            fallbackTitle={design.name}
            fallbackDescription="效果图正在加载，请稍候..."
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <span className={`absolute bottom-4 left-4 badge ${styleConfig.bgColor} ${styleConfig.color} text-sm shadow-sm`}>
            {styleConfig.name}
          </span>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-56.25vw)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-800">{design.name}</h3>
            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{isFavorite ? '已收藏' : '收藏方案'}</span>
            </button>
          </div>

          <p className="text-slate-600 mb-6">{design.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">预估预算</span>
              </div>
              <p className="font-semibold text-slate-800">{design.estimatedBudget}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">适用人群</span>
              </div>
              <p className="font-semibold text-slate-800">{design.suitableFor}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              方案特色
            </h4>
            <div className="flex flex-wrap gap-2">
              {design.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-primary-600" />
              包含物品
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {design.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FuneralHallReference = () => {
  const { deceased, toggleFavoriteHallDesign, isHallDesignFavorite, activeFavoriteHallDesigns } = useStore();
  const [selectedStyle, setSelectedStyle] = useState<FuneralHallStyle | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<FuneralHallDesign | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredDesigns = funeralHallDesigns.filter((design) => {
    if (selectedStyle !== 'all' && design.style !== selectedStyle) return false;
    if (showFavoritesOnly && deceased) {
      const isFav = activeFavoriteHallDesigns.some((f) => f.designId === design.id);
      if (!isFav) return false;
    }
    return true;
  });

  const handleToggleFavorite = (designId: string) => {
    if (!deceased) return;
    toggleFavoriteHallDesign(designId, deceased.id);
  };

  const handleViewDetail = (design: FuneralHallDesign) => {
    setSelectedDesign(design);
    setShowDetailModal(true);
  };

  const isDesignFavorite = (designId: string) => {
    if (!deceased) return false;
    return isHallDesignFavorite(designId, deceased.id);
  };

  const styleOptions = [
    { id: 'all' as const, label: '全部风格' },
    ...Object.entries(FUNERAL_HALL_STYLE_CONFIG).map(([key, value]) => ({
      id: key as FuneralHallStyle,
      label: value.name,
    })),
  ];

  return (
    <div className="animate-fade-in">
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedStyle === style.id
                    ? 'bg-primary-700 text-white shadow-md shadow-primary-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            仅看收藏
            {activeFavoriteHallDesigns.length > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                {activeFavoriteHallDesigns.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDesigns.map((design, index) => (
            <HallDesignCard
              key={design.id}
              design={design}
              isFavorite={isDesignFavorite(design.id)}
              onToggleFavorite={() => handleToggleFavorite(design.id)}
              onViewDetail={() => handleViewDetail(design)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-2">
            {showFavoritesOnly ? '暂无收藏方案' : '暂无符合条件的方案'}
          </h4>
          <p className="text-sm text-slate-500">
            {showFavoritesOnly ? '点击方案卡片上的心形按钮收藏中意的方案' : '试试选择其他风格'}
          </p>
        </div>
      )}

      <HallDesignDetailModal
        design={selectedDesign}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isFavorite={selectedDesign ? isDesignFavorite(selectedDesign.id) : false}
        onToggleFavorite={() => selectedDesign && handleToggleFavorite(selectedDesign.id)}
      />
    </div>
  );
};
